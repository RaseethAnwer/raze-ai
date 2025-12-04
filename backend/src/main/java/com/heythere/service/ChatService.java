package com.heythere.service;

import com.heythere.model.ChatMessage;
import com.heythere.model.ChatSession;
import com.heythere.repository.ChatMessageRepository;
import com.heythere.repository.ChatSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    @Autowired
    private ChatSessionRepository sessionRepository;

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private GeminiService geminiService;

    private final String UPLOAD_DIR = "uploads/";

    public ChatSession createSession(Long userId) {
        ChatSession session = new ChatSession();
        session.setUserId(userId);
        session.setTitle("New Chat");
        return sessionRepository.save(session);
    }

    public List<ChatSession> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ChatMessage> getSessionMessages(Long sessionId) {
        return messageRepository.findBySessionSessionIdOrderByTimestampAsc(sessionId);
    }

    public ChatMessage sendMessage(Long sessionId, String text, MultipartFile image) throws IOException {
        ChatSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Save User Message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setSession(session);
        userMessage.setSender("USER");
        userMessage.setMessageText(text);

        String imagePath = null;
        if (image != null && !image.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);
            imagePath = filePath.toString();
            userMessage.setImagePath(fileName); // Store relative path or filename
        }
        messageRepository.save(userMessage);

        // Update Session Title if it's the first message
        if (session.getMessages().size() <= 1) {
            String title = text.length() > 30 ? text.substring(0, 30) + "..." : text;
            session.setTitle(title);
            sessionRepository.save(session);
        }

        // Call Gemini
        String aiResponseText;
        if (imagePath != null) {
            aiResponseText = geminiService.callGeminiWithImage(text, imagePath);
        } else {
            aiResponseText = geminiService.callGrok(text);
        }

        // Save AI Message
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setSession(session);
        aiMessage.setSender("AI");
        aiMessage.setMessageText(aiResponseText);
        return messageRepository.save(aiMessage);
    }
}

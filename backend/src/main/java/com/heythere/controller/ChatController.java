package com.heythere.controller;

import com.heythere.model.ChatMessage;
import com.heythere.model.ChatSession;
import com.heythere.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/session")
    public ResponseEntity<ChatSession> createSession(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.createSession(userId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatSession>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserSessions(userId));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ChatMessage>> getSessionMessages(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatService.getSessionMessages(sessionId));
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestParam Long sessionId,
            @RequestParam(required = false, defaultValue = "gemini-2.0-flash") String model,
            @RequestParam(required = false, defaultValue = "") String text,
            @RequestParam(required = false) MultipartFile image) {
        try {
            return ResponseEntity.ok(chatService.sendMessage(sessionId, model, text, image));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

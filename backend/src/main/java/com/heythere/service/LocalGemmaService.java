package com.heythere.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

@Service
public class LocalGemmaService {

    public String call(String message, MultipartFile image) {
        // Image handling not supported for this local text model
        return runLocalModel(message);
    }

    private String runLocalModel(String prompt) {
        try {
            String llamaExe = "C:\\ai-local\\llama\\bin\\llama-cli.exe";
            String model = "C:\\ai-local\\models\\gemma-2b-it.gguf";

            // Construct command strictly as requested
            List<String> command = Arrays.asList(
                    llamaExe,
                    "-m", model,
                    "-p", prompt,
                    "--ctx-size", "1024",
                    "--threads", "4"
            );

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true); // Merge stderr into stdout

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            // Read output
            while ((line = reader.readLine()) != null) {
                // Filter out system info logs if needed, but for now capturing everything
                // Llama-cli often outputs a lot of init info.
                // We might want to filter valid response, but let's capture all for now as per sample
                 output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return "Error: Local AI process exited with code " + exitCode + "\nLogs:\n" + output;
            }

            // Cleanup output to extract just the AI response if possible.
            // But usually llama-cli prints the prompt then the completion.
            // The sample code just printed everything. We'll return everything for now.
            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error running local AI: " + e.getMessage();
        }
    }
}

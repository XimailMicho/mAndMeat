package mk.mandm.controller;

import mk.mandm.dto.LoginRequest;
import mk.mandm.dto.AuthResponse;
import mk.mandm.dto.MeResponse;
import mk.mandm.model.User;
import mk.mandm.security.CustomUserDetails;
import mk.mandm.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(@AuthenticationPrincipal CustomUserDetails principal) {
        User user = principal.getUser();
        return ResponseEntity.ok(
                new MeResponse(user.getId(), user.getEmail(), user.getRole().name())
        );
    }



    @GetMapping("/test-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> testAdmin() {
        return ResponseEntity.ok("Welcome, Admin!");
    }



}

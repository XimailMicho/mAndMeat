package mk.mandm.controller;

import mk.mandm.dto.LoginRequest;
import mk.mandm.dto.AuthResponse;
import mk.mandm.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/test-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> testAdmin() {
        return ResponseEntity.ok("Welcome, Admin!");
    }

//    @GetMapping("/debug-auth")
//    public ResponseEntity<?> debug(Authentication authentication) {
//        return ResponseEntity.ok(authentication.getAuthorities());
//    }

    @GetMapping("/api/auth/debug")
    public Map<String, Object> debug(Authentication authentication) {
        return Map.of(
                "principal", authentication.getPrincipal().getClass().getName(),
                "authorities", authentication.getAuthorities().toString()
        );
    }

}

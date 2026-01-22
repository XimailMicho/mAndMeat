package mk.mandm.config;

import mk.mandm.model.User;
import mk.mandm.model.Role;
import mk.mandm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUserIfMissing("admin@email.com", "admin123", Role.ADMIN);
        seedUserIfMissing("worker@email.com", "worker123", Role.WORKER);
        seedUserIfMissing("partner@email.com", "partner123", Role.PARTNER);
    }

    private void seedUserIfMissing(String email, String rawPassword, Role role) {
        if (userRepository.existsByEmail(email)) return;

        User u = new User();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole(role);

        userRepository.save(u);
        System.out.println("Seeded user: " + email + " role=" + role);
    }
}

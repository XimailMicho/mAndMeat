package mk.mandm.config;


import mk.mandm.model.Admin;
import mk.mandm.model.Role;
import mk.mandm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@email.com").isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail("admin@email.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // store hashed password
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("Admin user seeded.");
            } else {
                System.out.println("Admin user already exists. Skipping seed.");
            }
        };
    }
}

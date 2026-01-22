package mk.mandm.repository;

import mk.mandm.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByEmail(String email);
    boolean existsByEmail(String email);
}

package mk.mandm.service;

import mk.mandm.dto.CreatePartnerRequest;
import mk.mandm.dto.CreateWorkerRequest;
import mk.mandm.dto.PartnerResponse;
import mk.mandm.dto.WorkerResponse;
import mk.mandm.model.Partner;
import mk.mandm.model.Role;
import mk.mandm.model.Worker;
import mk.mandm.repository.PartnerRepository;
import mk.mandm.repository.UserRepository;
import mk.mandm.repository.WorkerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PartnerRepository partnerRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        WorkerRepository workerRepository,
                        PartnerRepository partnerRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.partnerRepository = partnerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public WorkerResponse createWorker(CreateWorkerRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Worker w = new Worker();
        w.setEmail(req.getEmail());
        w.setPassword(passwordEncoder.encode(req.getPassword()));
        w.setRole(Role.WORKER);

        w.setEmbg(req.getEmbg());
        w.setName(req.getName());
        w.setSurname(req.getSurname());

        Worker saved = workerRepository.save(w);

        return new WorkerResponse(saved.getId(), saved.getEmail(), saved.getRole().name(),
                saved.getEmbg(), saved.getName(), saved.getSurname());
    }

    public PartnerResponse createPartner(CreatePartnerRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Partner p = new Partner();
        p.setEmail(req.getEmail());
        p.setPassword(passwordEncoder.encode(req.getPassword()));
        p.setRole(Role.PARTNER);

        p.setName(req.getName());
        p.setDateCreated(req.getDateCreated() != null ? req.getDateCreated() : LocalDate.now());

        Partner saved = partnerRepository.save(p);

        return new PartnerResponse(saved.getId(), saved.getEmail(), saved.getRole().name(),
                saved.getName(), saved.getDateCreated());
    }
    public List<WorkerResponse> listWorkers() {
        return workerRepository.findAll().stream()
                .map(w -> new WorkerResponse(
                        w.getId(), w.getEmail(), w.getRole().name(),
                        w.getEmbg(), w.getName(), w.getSurname()
                ))
                .toList();
    }

    public List<PartnerResponse> listPartners() {
        return partnerRepository.findAll().stream()
                .map(p -> new PartnerResponse(
                        p.getId(), p.getEmail(), p.getRole().name(),
                        p.getName(), p.getDateCreated()
                ))
                .toList();
    }
}

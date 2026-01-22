package mk.mandm.controller;

import jakarta.validation.Valid;
import mk.mandm.dto.CreatePartnerRequest;
import mk.mandm.dto.CreateWorkerRequest;
import mk.mandm.dto.PartnerResponse;
import mk.mandm.dto.WorkerResponse;
import mk.mandm.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/workers")
    public ResponseEntity<WorkerResponse> createWorker(@Valid @RequestBody CreateWorkerRequest request) {
        return ResponseEntity.ok(adminService.createWorker(request));
    }

    @PostMapping("/partners")
    public ResponseEntity<PartnerResponse> createPartner(@Valid @RequestBody CreatePartnerRequest request) {
        return ResponseEntity.ok(adminService.createPartner(request));
    }
    @GetMapping("/workers")
    public ResponseEntity<List<WorkerResponse>> listWorkers() {
        return ResponseEntity.ok(adminService.listWorkers());
    }

    @GetMapping("/partners")
    public ResponseEntity<List<PartnerResponse>> listPartners() {
        return ResponseEntity.ok(adminService.listPartners());
    }

}

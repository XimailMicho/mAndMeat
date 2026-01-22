package mk.mandm.dto;



import java.time.LocalDate;

public class PartnerResponse {
    private Long id;
    private String email;
    private String role;
    private String name;
    private LocalDate dateCreated;

    public PartnerResponse(Long id, String email, String role, String name, LocalDate dateCreated) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.name = name;
        this.dateCreated = dateCreated;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getName() { return name; }
    public LocalDate getDateCreated() { return dateCreated; }
}

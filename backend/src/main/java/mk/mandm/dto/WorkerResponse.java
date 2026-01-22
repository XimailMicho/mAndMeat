package mk.mandm.dto;


public class WorkerResponse {
    private Long id;
    private String email;
    private String role;
    private String embg;
    private String name;
    private String surname;

    public WorkerResponse(Long id, String email, String role, String embg, String name, String surname) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.embg = embg;
        this.name = name;
        this.surname = surname;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getEmbg() { return embg; }
    public String getName() { return name; }
    public String getSurname() { return surname; }
}

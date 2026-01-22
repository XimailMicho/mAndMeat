package mk.mandm.dto;


import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class CreatePartnerRequest {


    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    // Optional: let admin send it OR you set it server-side to LocalDate.now()
    private LocalDate dateCreated;

    // getters/setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDateCreated() { return dateCreated; }
    public void setDateCreated(LocalDate dateCreated) { this.dateCreated = dateCreated; }
}

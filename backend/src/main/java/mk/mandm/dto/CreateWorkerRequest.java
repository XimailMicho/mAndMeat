package mk.mandm.dto;




import jakarta.validation.constraints.NotBlank;


public class CreateWorkerRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String embg;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    // getters/setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmbg() { return embg; }
    public void setEmbg(String embg) { this.embg = embg; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
}

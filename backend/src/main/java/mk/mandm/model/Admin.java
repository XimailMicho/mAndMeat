package mk.mandm.model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import mk.mandm.model.enums.Role;

@Getter
@Setter
@Entity
public class Admin extends User {

    public Admin() {
        super();
    }

    public Admin(String email, String password, Role role) {
        super(email, password, role);
    }

}

package mk.mandm.model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

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

    // You can also add more constructors if Admin had additional fields
}

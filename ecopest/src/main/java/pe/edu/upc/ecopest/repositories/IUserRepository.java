package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    List<User> findByBusinessEntity_IdBusinessEntity(Long businessEntityId);
    Optional<User> findByEmail(String email);
}
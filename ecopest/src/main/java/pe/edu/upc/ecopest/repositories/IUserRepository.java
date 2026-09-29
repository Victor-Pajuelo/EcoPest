package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    List<User> findByBusinessEntity_IdBusinessEntity(Long businessEntityId);
    Optional<User> findByEmail(String email);

    @Query(value = "SELECT r.name, COUNT(u.id_user) " +
            "FROM roles r LEFT JOIN users u ON r.id_role = u.id_role " +
            "GROUP BY r.name", nativeQuery = true)
    List<Object[]> countUsersByRole();
}
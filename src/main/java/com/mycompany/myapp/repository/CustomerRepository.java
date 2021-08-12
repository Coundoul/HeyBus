package com.mycompany.myapp.repository;

import java.util.Optional;

import com.mycompany.myapp.domain.Customer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findOneByEmailIgnoreCase(String email);  
}

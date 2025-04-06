package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}
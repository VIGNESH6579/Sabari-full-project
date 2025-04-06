package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
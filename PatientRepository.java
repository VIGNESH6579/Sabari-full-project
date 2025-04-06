package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
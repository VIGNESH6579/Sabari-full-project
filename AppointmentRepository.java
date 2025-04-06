package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
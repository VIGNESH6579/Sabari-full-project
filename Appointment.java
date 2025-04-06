package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private Date date;
    private String time;
    private String reason;
    private String status;
    private String notes;

    // Getters and setters
    // Constructors
}
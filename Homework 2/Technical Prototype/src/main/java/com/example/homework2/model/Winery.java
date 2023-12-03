package com.example.homework2.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name="wineries")
@AllArgsConstructor
@NoArgsConstructor
public class Winery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Double lat;
    @NotNull
    private Double lon;
    private String street;
    private String city;
    private String craft;
    @Column(unique = true)
    private String name;
    private String openingHours;
    private String phone;
    private String website;
    private String email;
    private boolean currentlyOpen;
}

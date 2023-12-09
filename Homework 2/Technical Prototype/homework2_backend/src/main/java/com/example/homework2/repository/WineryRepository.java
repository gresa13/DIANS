package com.example.homework2.repository;

import com.example.homework2.model.Winery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WineryRepository extends JpaRepository< Winery,Long> {
    List<Winery> findWineriesByCity(String city);
    Optional<Winery> findWineryByName(String name);
    Optional<Winery> findWineryById(Long id);
}

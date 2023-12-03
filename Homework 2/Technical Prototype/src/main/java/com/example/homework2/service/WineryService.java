package com.example.homework2.service;

import com.example.homework2.exceptions.WineryAlreadyExistsException;
import com.example.homework2.exceptions.WineryDoesNotExistException;
import com.example.homework2.exceptions.WineryNotFoundException;
import com.example.homework2.model.Winery;

import java.util.List;
import java.util.Optional;

public interface WineryService {
    public List<Winery> findAll();
    public Winery findById(Long id) throws WineryNotFoundException;
    public Winery findWineryByName(String name) throws WineryDoesNotExistException;
    public List<Winery> findWineriesByCity(String city);
    public Winery saveWinery(Winery winery) throws WineryAlreadyExistsException;
    public void deleteWinery(Long id) throws WineryNotFoundException;
    public void updateWinery(Long id, Winery winery) throws WineryNotFoundException;
}

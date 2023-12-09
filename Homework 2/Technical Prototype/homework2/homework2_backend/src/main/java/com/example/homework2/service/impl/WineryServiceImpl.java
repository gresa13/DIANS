package com.example.homework2.service.impl;

import com.example.homework2.exceptions.WineryAlreadyExistsException;
import com.example.homework2.exceptions.WineryDoesNotExistException;
import com.example.homework2.exceptions.WineryNotFoundException;
import com.example.homework2.model.Winery;
import com.example.homework2.repository.WineryRepository;
import com.example.homework2.service.WineryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WineryServiceImpl implements WineryService {
    private final WineryRepository wineryRepository;

    public WineryServiceImpl(WineryRepository wineryRepository) {
        this.wineryRepository = wineryRepository;
    }

    @Override
    public List < Winery > findAll() {
        return wineryRepository.findAll ();
    }

    @Override
    public Winery findById(Long id) throws WineryNotFoundException {
        Optional<Winery> winery=wineryRepository.findById ( id );
        if (winery.isEmpty ())
            throw new WineryNotFoundException ();
        return winery.get ();
    }

    @Override
    public Winery findWineryByName(String name) {
        Optional<Winery> winery=wineryRepository.findWineryByName ( name );
        if (winery.isEmpty ())
            throw new WineryDoesNotExistException ();
        return winery.get ();
    }

    @Override
    public List < Winery > findWineriesByCity(String city) {
        return wineryRepository.findWineriesByCity ( city );
    }

    @Override
    public Winery saveWinery(Winery winery) throws WineryAlreadyExistsException {
        Optional<Winery> winery1=wineryRepository.findWineryById ( winery.getId () );
        if (winery1.isPresent ())
            throw new WineryAlreadyExistsException ();
        return wineryRepository.save ( winery );
    }

    @Override
    public void deleteWinery(Long id) throws WineryNotFoundException {
        Optional<Winery> winery=wineryRepository.findWineryById ( id );
        if (winery.isEmpty ( ))
            throw new WineryNotFoundException ();
        wineryRepository.deleteById ( id );
    }

    @Override
    public void updateWinery(Long id, Winery winery) throws WineryNotFoundException {
        Optional<Winery> winery1 = wineryRepository.findById(id);
        if (winery1.isEmpty()) {
            throw new WineryNotFoundException();
        }
        Winery winery2 = winery1.get();
        winery2.setName (winery.getName ());
        winery2.setCity (winery.getCity ());
        winery2.setLat (winery.getLat ());
        winery2.setLon (winery.getLon ());
        wineryRepository.save(winery2);
    }
}

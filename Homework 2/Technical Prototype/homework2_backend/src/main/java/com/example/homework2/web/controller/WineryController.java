package com.example.homework2.web.controller;

import com.example.homework2.exceptions.WineryAlreadyExistsException;
import com.example.homework2.exceptions.WineryDoesNotExistException;
import com.example.homework2.exceptions.WineryNotFoundException;
import com.example.homework2.model.Winery;
import com.example.homework2.service.WineryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wineries")
@Validated

public class WineryController {
    private final WineryService wineryService;

    public WineryController(WineryService wineryService) {
        this.wineryService = wineryService;
    }

    @GetMapping
    public ResponseEntity<List < Winery >> getAllWineries() {
        List<Winery> wineries=wineryService.findAll ();
        return new ResponseEntity <> ( wineries, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Winery> getWineryById(@PathVariable Long id) throws WineryNotFoundException {
        Winery winery=wineryService.findById ( id );
        return new ResponseEntity<>(winery,HttpStatus.OK);
    }

    @GetMapping("/winery/{name}")
    public ResponseEntity<Winery> getWineryByName(@PathVariable String name) throws WineryDoesNotExistException {
        Winery winery1=wineryService.findWineryByName ( name );
        return new ResponseEntity<>(winery1,HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Winery> createWinery(@RequestBody Winery winery) throws WineryAlreadyExistsException {
        Winery winery1=wineryService.saveWinery ( winery );
        return new ResponseEntity<> ( winery1, HttpStatus.CREATED);
    }
    @PostMapping("/update/{id}")
    public ResponseEntity updateWinery(@PathVariable Long id,
                                       @RequestBody Winery winery) throws WineryNotFoundException{
        wineryService.updateWinery (id, winery);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity deleteWinery(@PathVariable Long id)throws WineryNotFoundException{
        wineryService.deleteWinery (id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

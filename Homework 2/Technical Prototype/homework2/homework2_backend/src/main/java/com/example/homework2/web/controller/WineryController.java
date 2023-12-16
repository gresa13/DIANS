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

    @GetMapping("/{id}/details")
    public ResponseEntity<Winery> getWineryDetails(@PathVariable Long id) throws WineryNotFoundException {
        Winery winery=wineryService.findById ( id );
        return new ResponseEntity<>(winery,HttpStatus.OK);
    }

    @GetMapping("/winery/{name}")
    public ResponseEntity<Winery> getWineryByName(@PathVariable String name) throws WineryDoesNotExistException {
        Winery winery1=wineryService.findWineryByName ( name );
        return new ResponseEntity<>(winery1,HttpStatus.OK);
    }

    @GetMapping("/{id}/distance")
    public ResponseEntity<Double> calculateDistance(
            @PathVariable Long id,
            @RequestParam double userLat,
            @RequestParam double userLng) {
        Winery winery=wineryService.findById ( id );
        double distance=calculateDistance(userLat, userLng, winery.getLat (), winery.getLon ());
        return ResponseEntity.ok(distance);
//        return wineryService.findById(id)
//                .map(winery -> {
//                    double distance = Haversine.distance(userLat, userLng, winery.getLatitude(), winery.getLongitude());
//                    return ResponseEntity.ok(distance);
//                })
//                .orElse(ResponseEntity.notFound().build());
    }

    private double calculateDistance(double startLat, double startLong, double endLat, double endLong) {
        final int EARTH_RADIUS = 6371; // Radius of the earth in kilometers

        double dLat = Math.toRadians(endLat - startLat);
        double dLong = Math.toRadians(endLong - startLong);

        startLat = Math.toRadians(startLat);
        endLat = Math.toRadians(endLat);

        double a = haversin(dLat) + Math.cos(startLat) * Math.cos(endLat) * haversin(dLong);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // Distance in kilometers
    }

    private double haversin(double value) {
        return Math.pow(Math.sin(value / 2), 2);
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

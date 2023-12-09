package com.example.homework2.exceptions;

public class WineryDoesNotExistException extends RuntimeException{
    public WineryDoesNotExistException() {
        super("The winery you are looking for does not exist");
    }
}

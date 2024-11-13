package com.example.demo.exceptions.customexceptions.exceptionsEntity;


import com.example.demo.exceptions.messages.ErrorMessages;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileControllerException extends RuntimeException {
    private static final Logger logger = LoggerFactory.getLogger(FileControllerException.class);

    public FileControllerException() {
        super(ErrorMessages.FILE_UPLOAD_ERROR);
        logger.error(ErrorMessages.FILE_UPLOAD_ERROR);
    }

    public FileControllerException(String message) {
        super(message);
        logger.error(message);
    }

    public FileControllerException(String message, Throwable cause) {
        super(message, cause);
        logger.error(message, cause);
    }
}
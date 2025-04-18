// InformacionInstitucionalRepository.java
package com.example.demo.repositories.mongo;

import com.example.demo.model.entity.InformacionInstitucional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InformacionInstitucionalRepository extends MongoRepository<InformacionInstitucional, String> {
}
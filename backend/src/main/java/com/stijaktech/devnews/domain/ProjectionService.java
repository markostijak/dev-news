package com.stijaktech.devnews.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.CollectionFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.rest.core.projection.ProjectionDefinitions;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class ProjectionService {

    private ProjectionFactory projectionFactory;
    private ProjectionDefinitions projectionDefinitions;

    @Autowired
    public ProjectionService(ProjectionFactory projectionFactory, ProjectionDefinitions projectionDefinitions) {
        this.projectionFactory = projectionFactory;
        this.projectionDefinitions = projectionDefinitions;
    }

    public boolean hasProjection(Class<?> type, String projection) {
        return !StringUtils.isEmpty(projection) && projectionDefinitions.getProjectionType(type, projection) != null;
    }

    public Page<?> createProjection(Page<?> page, Class<?> type, String projection) {
        Class<?> projectionType = getProjection(type, projection);
        return page.map(p -> projectionFactory.createProjection(projectionType, p));
    }

    @SuppressWarnings("unchecked")
    public <T extends Collection> T createProjection(T collection, Class<?> type, String projection) {
        Class<?> projectionType = getProjection(type, projection);

        Collection newCollection = CollectionFactory.createCollection(collection.getClass(), collection.size());

        return (T) collection.stream()
                .map(p -> projectionFactory.createProjection(projectionType, p))
                .collect(Collectors.toCollection(() -> newCollection));
    }

    @SuppressWarnings("unchecked")
    public <T> T createProjection(Object source, Class<?> type, String projection) {
        Class<?> projectionType = getProjection(type, projection);
        return (T) projectionFactory.createProjection(projectionType, source);
    }

    private Class<?> getProjection(Class<?> type, String projection) {
        Class<?> projectionType = projectionDefinitions.getProjectionType(type, projection);
        Assert.notNull(projectionType, "Projection " + projection + " not found!");
        return projectionType;
    }

}

package com.stijaktech.devnews.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mapping.PersistentEntity;
import org.springframework.data.mapping.context.PersistentEntities;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.rest.core.projection.ProjectionDefinitions;
import org.springframework.data.rest.core.support.SelfLinkProvider;
import org.springframework.data.rest.webmvc.EmbeddedResourcesAssembler;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.mapping.Associations;
import org.springframework.data.rest.webmvc.support.DefaultExcerptProjector;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.core.EmbeddedWrapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.stream.StreamSupport;

import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toList;

@Component
public class ModelAssembler implements RepresentationModelAssembler<Object, EntityModel<Object>> {

    private final ModelProjector projector;
    private final PersistentEntities entities;
    private final SelfLinkProvider linkProvider;
    private final EmbeddedResourcesAssembler embeddedAssembler;

    @Autowired
    public ModelAssembler(Associations associations,
                          PersistentEntities entities,
                          ProjectionFactory projectionFactory,
                          ProjectionDefinitions projectionDefinitions,
                          SelfLinkProvider linkProvider) {

        this.entities = entities;
        this.linkProvider = linkProvider;
        this.projector = new ModelProjector(projectionFactory, projectionDefinitions, associations);
        this.embeddedAssembler = new EmbeddedResourcesAssembler(entities, associations, projector);
    }

    @NonNull
    @Override
    public EntityModel<Object> toModel(@NonNull Object instance) {
        return wrap(projector.projectExcerpt(instance), instance);
    }

    @NonNull
    public <T> EntityModel<T> toModel(@NonNull Object instance, @NonNull Class<T> projection) {
        return wrap(projector.project(instance, projection), instance);
    }

    @NonNull
    public <T> EntityModel<T> toModel(@NonNull Object instance, @NonNull Object projection) {
        return wrap(projection, instance);
    }

    @NonNull
    public <T> EntityModel<T> toModel(@NonNull Object instance, String projection) {
        return wrap(projector.project(instance, projection), instance);
    }

    @NonNull
    public <T> CollectionModel<EntityModel<T>> toCollectionModel(@NonNull Iterable<?> entities, @NonNull Class<T> projection) {
        return StreamSupport.stream(entities.spliterator(), false)
                .map(e -> toModel(e, projection))
                .collect(collectingAndThen(toList(), CollectionModel::of));
    }

    @SuppressWarnings("unchecked")
    private <T> EntityModel<T> wrap(Object instance, Object source) {
        PersistentEntity<?, ?> entity = entities.getRequiredPersistentEntity(source.getClass());

        return (EntityModel<T>) PersistentEntityResource.build(instance, entity)
                .withEmbedded(getEmbeddedResources(source))
                .withLink(getExpandedSelfLink(source))
                .withLink(linkProvider.createSelfLinkFor(source))
                .build();
    }

    private Iterable<EmbeddedWrapper> getEmbeddedResources(Object instance) {
        return embeddedAssembler.getEmbeddedResources(instance);
    }

    private Link getExpandedSelfLink(Object instance) {
        return linkProvider.createSelfLinkFor(instance).withSelfRel().expand();
    }

    static class ModelProjector extends DefaultExcerptProjector {

        private final ProjectionFactory projectionFactory;
        private final ProjectionDefinitions projectionDefinitions;

        public ModelProjector(ProjectionFactory projectionFactory,
                              ProjectionDefinitions projectionDefinitions,
                              Associations associations) {
            super(projectionFactory, associations.getMappings());
            this.projectionFactory = projectionFactory;
            this.projectionDefinitions = projectionDefinitions;
        }

        public Object project(@NonNull Object source) {
            return super.projectExcerpt(source);
        }

        public Object project(@NonNull Object source, String projection) {
            Class<?> projectionType = getProjection(source.getClass(), projection);

            if (projectionType == null) {
                return source;
            }

            return projectionFactory.createProjection(projectionType, source);
        }

        public <T> T project(@NonNull Object source, Class<T> projectionType) {
            return (T) projectionFactory.createProjection(projectionType, source);
        }

        public boolean hasProjection(Class<?> type, String projection) {
            return StringUtils.hasText(projection) && getProjection(type, projection) != null;
        }

        private Class<?> getProjection(Class<?> type, String projection) {
            return projectionDefinitions.getProjectionType(type, projection);
        }

    }

}

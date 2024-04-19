import {CreateOptions, FilterQuery, Model, QueryOptions, Types, UpdateQuery} from 'mongoose';

export abstract class BaseRepository<T> {
  protected constructor(private model: Model<T>) {}

  /**
   * Perform distinct operation
   * @param {String} field
   * @param {object|Query} [filter]
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.distinct}
   * @returns {*}
   */
  distinct(field: string, filter?: FilterQuery<T>) {
    return this.model.distinct(field, filter);
  }

  /**
   * Perform aggregate operation
   * @param {Array} pipeline
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.aggregate}
   * @returns {*}
   */
  aggregate(pipeline: any[], options?: object) {
    return this.model.aggregate(pipeline, options);
  }

  /**
   * Create one doc
   * @param {object} doc
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.create}
   * @returns {*}
   */
  createOne(doc: T) {
    return this.model.create(doc);
  }

  /**
   * Create multiple docs
   * @param {Array} docs
   * @param {object} [options]
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.create}
   * @returns {*}
   */
  createMany(docs: T[], options?: CreateOptions) {
    return this.model.create(docs, options);
  }

  /**
   * Creates multiple docs
   * @param docs
   * @param {object} [options]
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.insertMany}
   * @returns {*}
   */
  insertMany(docs: T | T[], options?: NonNullable<unknown>) {
    return this.model.insertMany(docs, options);
  }

  /**
   * Finds all the documents that match conditions
   * @param {object} filter
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.find}
   * @returns {*}
   */
  find(
    filter: FilterQuery<T>,
    projection?: NonNullable<unknown> | string | string[],
    options?: NonNullable<unknown>
  ) {
    return this.model.find(filter, projection, options);
  }

  /**
   * Finds the first document that matches conditions
   * @param {object} conditions
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.findOne}
   * @returns {*}
   */
  findOne(conditions: FilterQuery<T>, projection?: object | string | string[], options?: object) {
    return this.model.findOne(conditions, projection, options);
  }

  /**
   * Finds a single document by its _id field
   * @param {*} id
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.findById}
   * @returns {*}
   */
  findById(id: any, projection?: object | string | string[], options?: object) {
    return this.model.findById(id, projection, options);
  }

  /**
   * Updates the first document that matches conditions
   * @param {object} filter
   * @param {object|Array} update
   * @param {object} [options]
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.updateOne}
   * @returns {*}
   */
  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T> | object[], options?: object) {
    return this.model.updateOne(filter, update, options);
  }

  /**
   * Updates all the documents that match conditions
   * @param {object} filter
   * @param {object|Array} update
   * @param {object} [options]
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.updateMany}
   * @returns {*}
   */
  updateMany(filter: FilterQuery<T>, update: UpdateQuery<T> | object[], options?: object) {
    return this.model.updateMany(filter, update, options);
  }

  /**
   * Deletes the first document that matches conditions
   * @param {object} filter
   * @param {object} update
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne}
   * @returns {*}
   */
  deleteOne(filter: FilterQuery<T>, update?: object) {
    return this.model.deleteOne(filter, update);
  }

  /**
   * Deletes all the documents that match conditions
   * @param {object} conditions
   * @param {object} [options]
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.deleteMany}
   * @returns {*}
   */
  deleteMany(conditions: FilterQuery<T>, options?: object) {
    return this.model.deleteMany(conditions, options);
  }

  findByIdAndUpdate(id: Types.ObjectId | string, update: Partial<T>, options?: QueryOptions) {
    return this.model.findByIdAndUpdate(id, update, options);
  }
}

export default BaseRepository;

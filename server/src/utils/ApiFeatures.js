class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose Query (e.g., Product.find())
    this.queryString = queryString; // req.query (e.g., { price: { gt: '1000' }, sort: 'price' })
  }

  /**
   * 1. Filtering
   * Handles: ?price[gte]=1000&category=electronics
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering: Convert { price: { gte: '100' } } -> $gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|regex)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * 2. Sorting
   * Handles: ?sort=-price,createdAt
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Default: Newest first
    }
    return this;
  }

  /**
   * 3. Field Limiting (Projection)
   * Handles: ?fields=name,price,images (Reduces payload size)
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // Exclude internal version
    }
    return this;
  }

  /**
   * 4. Pagination
   * Handles: ?page=2&limit=10
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20; // Default 20 items
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { ApiFeatures };
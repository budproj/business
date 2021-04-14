export abstract class CoreEntitySpecification<T> {
  protected currentRevision: (candidate: T) => boolean

  public and(other: CoreEntitySpecification<T>) {
    return new AndSpecification(this, other)
  }

  public not() {
    return new NotSpecification(this)
  }

  public abstract isSatisfiedBy(candidate: T): boolean
}

class AndSpecification<T> extends CoreEntitySpecification<T> {
  private readonly one: CoreEntitySpecification<T>
  private readonly other: CoreEntitySpecification<T>

  public constructor(one: CoreEntitySpecification<T>, other: CoreEntitySpecification<T>) {
    super()
    this.one = one
    this.other = other
  }

  public isSatisfiedBy(candidate: T) {
    return this.one.isSatisfiedBy(candidate) && this.other.isSatisfiedBy(candidate)
  }
}

class NotSpecification<T> extends CoreEntitySpecification<T> {
  private readonly wrapped: CoreEntitySpecification<T>

  public constructor(wrapped: CoreEntitySpecification<T>) {
    super()
    this.wrapped = wrapped
  }

  public isSatisfiedBy(candidate: T) {
    return !this.wrapped.isSatisfiedBy(candidate)
  }
}

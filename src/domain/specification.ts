interface DomainSpecificationInterface<T> {
  currentRevision?: (candidate: T) => boolean

  isSatisfiedBy(candidate: T): boolean
  and(other: DomainSpecificationInterface<T>): DomainSpecificationInterface<T>
  not(): DomainSpecificationInterface<T>
}

abstract class DomainSpecification<T> implements DomainSpecificationInterface<T> {
  public and(other: DomainSpecificationInterface<T>) {
    return new AndSpecification(this, other)
  }

  public not() {
    return new NotSpecification(this)
  }

  public abstract isSatisfiedBy(candidate: T): boolean
}

class AndSpecification<T> extends DomainSpecification<T> {
  private readonly one: DomainSpecificationInterface<T>
  private readonly other: DomainSpecificationInterface<T>

  public constructor(one: DomainSpecificationInterface<T>, other: DomainSpecificationInterface<T>) {
    super()
    this.one = one
    this.other = other
  }

  public isSatisfiedBy(candidate: T) {
    return this.one.isSatisfiedBy(candidate) && this.other.isSatisfiedBy(candidate)
  }
}

class NotSpecification<T> extends DomainSpecification<T> {
  private readonly wrapped: DomainSpecificationInterface<T>

  public constructor(wrapped: DomainSpecificationInterface<T>) {
    super()
    this.wrapped = wrapped
  }

  public isSatisfiedBy(candidate: T) {
    return !this.wrapped.isSatisfiedBy(candidate)
  }
}

export default DomainSpecification

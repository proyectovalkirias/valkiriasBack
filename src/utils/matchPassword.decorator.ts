import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'matchPassword',
  async: false,
})
export class matchPassword implements ValidatorConstraintInterface {
  validate(
    password: any,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (password != (args.object as any)[args.constraints[0]]) return false;

    return true;
  }

  defaultMessage(args?: ValidationArguments): string {
    return 'Password do not match';
  }
}

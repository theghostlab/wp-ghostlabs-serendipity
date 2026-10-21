<?php

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Contracts\DTOValidationInterface;
use ReflectionClass;
use ReflectionException;
use ReflectionNamedType;
use ReflectionProperty;
use ReflectionUnionType;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Maps and validates an array into a typed DTO.
 *
 * ⚠️ This is a copy of the same class from the `ghostlabs/wp-kit` package, and the
 * duplication is deliberate. Do not "fix" it by re-adding the dependency.
 *
 * The free edition's sources are published to WordPress.org, where a reviewer is expected
 * to be able to check out the repository and run `composer install`. `ghostlabs/wp-kit` is
 * a private VCS repository, so that install fails for everyone outside the organization —
 * and a source distribution whose build cannot be reproduced is decoration.
 *
 * Of everything wp-kit offers, the block's server render needed exactly this class: one
 * `mapNested()` call in `render.php`, turning block attributes into an AttributesDto.
 * Copying ~280 lines was the cheapest of the three ways out (the others being to publish
 * wp-kit or to ship a vendor tree nobody can rebuild), so it is what was done.
 *
 * The cost is drift, and it is a real cost: this file and wp-kit's can diverge silently.
 * If wp-kit ever goes public, delete this class, delete `Contracts\DTOValidationInterface`
 * beside it, and put the dependency back.
 */
class DTOMapper {
    /**
     * @param array<string, mixed> $data
     * @param class-string $dtoClass
     * @return object
     * @throws ReflectionException
     */
    public static function map(array $data, string $dtoClass): object {
        $dto = new $dtoClass();
        $reflection = new ReflectionClass($dtoClass);
        $properties = $reflection->getProperties(ReflectionProperty::IS_PUBLIC);

        foreach ($properties as $property) {
            $propertyName = $property->getName();

            if (!array_key_exists($propertyName, $data)) {
                continue;
            }

            $value = $data[$propertyName];

            $type = $property->getType();
            if ($type !== null) {
                if ($type instanceof ReflectionNamedType) {
                    $typeName = $type->getName();
                } elseif ($type instanceof ReflectionUnionType) {
                    // First member wins, as it always has. An intersection type can
                    // appear inside a union (`A|(B&C)`) and has no single name to take,
                    // so it falls through to the string cast below rather than fataling
                    // on a getName() it does not have.
                    $first    = $type->getTypes()[0];
                    $typeName = $first instanceof ReflectionNamedType ? $first->getName() : (string) $first;
                } else {
                    $typeName = (string)$type;
                }

                switch ($typeName) {
                    case 'int':
                        $value = (int)$value;
                        break;
                    case 'float':
                        $value = (float)$value;
                        break;
                    case 'bool':
                        $value = (bool)$value;
                        break;
                    case 'array':
                        if (!is_array($value)) {
                            $value = [$value];
                        }
                        break;
                    case 'string':
                        $value = (string)$value;
                        break;
                    default:
                        if (enum_exists($typeName)) {
                            $value = self::coerceEnum($value, $typeName);
                        } elseif (class_exists($typeName) && is_array($value)) {
                            $value = self::map($value, $typeName);
                        }
                        break;
                }
            }

            $dto->$propertyName = $value;
        }

        return $dto;
    }

    /**
     * @param array<string, mixed> $data
     * @param class-string $dtoClass
     * @param array<string, class-string|array{0: class-string}> $nestedMappings
     * @return object
     * @throws ReflectionException
     */
    public static function mapNested(array $data, string $dtoClass, array $nestedMappings): object {
        $dto = self::map($data, $dtoClass);

        foreach ($nestedMappings as $property => $mapping) {
            if (!isset($data[$property])) {
                continue;
            }

            // map() wraps a scalar for an array-typed property; for a collection of DTOs that
            // is a list holding a string, which every reader then treats as an object.
            if (!is_array($data[$property])) {
                if (is_array($mapping)) {
                    $dto->$property = [];
                }

                continue;
            }

            if (is_array($mapping)) {
                $collection = [];
                foreach ($data[$property] as $item) {
                    // Only an array can become a DTO. Block attributes are author data, and a
                    // malformed item handed to map() is a TypeError that took the page down.
                    if ( ! is_array($item)) {
                        continue;
                    }

                    $collection[] = self::map($item, $mapping[0]);
                }
                $dto->$property = $collection;
            } else {
                $dto->$property = self::map($data[$property], $mapping);
            }
        }

        return $dto;
    }

    /**
     * @param object $dto
     * @param DTOValidationInterface|array<string, array<string, mixed>> $rules
     * @return array<string, array<string>>
     */
    public static function validate(object $dto, DTOValidationInterface|array $rules): array {
        if ($rules instanceof DTOValidationInterface) {
            $rules = $rules::rules();
        }
        $errors = [];

        foreach ($rules as $property => $propertyRules) {
            if (!property_exists($dto, $property)) {
                continue;
            }

            $value = $dto->$property;

            if ($value === null && empty($propertyRules['required'])) {
                continue;
            }

            foreach ($propertyRules as $rule => $ruleValue) {
                switch ($rule) {
                    case 'required':
                        if ($ruleValue && ($value === null || $value === '')) {
                            $errors[$property][] = "$property is required";
                        }
                        break;
                    case 'min':
                        if (is_string($value) && strlen($value) < $ruleValue) {
                            $errors[$property][] = "$property must be at least $ruleValue characters";
                        } elseif (is_numeric($value) && $value < $ruleValue) {
                            $errors[$property][] = "$property must be at least $ruleValue";
                        }
                        break;
                    case 'max':
                        if (is_string($value) && strlen($value) > $ruleValue) {
                            $errors[$property][] = "$property must not exceed $ruleValue characters";
                        } elseif (is_numeric($value) && $value > $ruleValue) {
                            $errors[$property][] = "$property must not exceed $ruleValue";
                        }
                        break;
                    case 'email':
                        if ($ruleValue && $value !== null && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$property][] = "$property must be a valid email";
                        }
                        break;
                    case 'regex':
                        if ($value !== null && !preg_match($ruleValue, $value)) {
                            $errors[$property][] = "$property has an invalid format";
                        }
                        break;
                    case 'enum':
                        if ($value !== null && !self::isValidEnumValue($value, $ruleValue)) {
                            $allowed = implode(', ', self::allowedEnumValues($ruleValue));
                            $errors[$property][] = "$property must be one of: $allowed";
                        }
                        break;
                    case 'nested':
                        if (is_object($value)) {
                            $nestedRules = is_string($ruleValue) ? $ruleValue::rules() : $ruleValue;
                            $nestedErrors = self::validate($value, $nestedRules);
                            foreach ($nestedErrors as $nestedProp => $nestedErrs) {
                                $errors["$property.$nestedProp"] = $nestedErrs;
                            }
                        }
                        break;
                }
            }
        }

        return $errors;
    }

    /**
     * Determine whether a value is a member of the given enum constraint.
     *
     * @param mixed $value
     * @param class-string|array<int, mixed> $constraint A backed/pure enum class name or a list of allowed scalar values.
     * @return bool
     */
    private static function isValidEnumValue(mixed $value, string|array $constraint): bool {
        if (is_array($constraint)) {
            return in_array($value, $constraint, true);
        }

        if (!enum_exists($constraint)) {
            return false;
        }

        return self::coerceEnum($value, $constraint) !== null;
    }

    /**
     * Coerce a scalar (or existing enum instance) into a case of the given enum class.
     * Returns null when the value is not a legal member, so the caller (map/validate)
     * can surface a meaningful error rather than assigning an illegal value.
     *
     * @param mixed $value
     * @param class-string $enumClass A backed or pure enum class name.
     * @return \UnitEnum|null
     */
    private static function coerceEnum(mixed $value, string $enumClass): ?\UnitEnum {
        if (!enum_exists($enumClass)) {
            return null;
        }

        if (is_object($value) && $value instanceof $enumClass) {
            return $value;
        }

        if (is_subclass_of($enumClass, \BackedEnum::class)) {
            return (is_int($value) || is_string($value)) ? $enumClass::tryFrom($value) : null;
        }

        foreach ($enumClass::cases() as $case) {
            if ($case->name === $value) {
                return $case;
            }
        }

        return null;
    }

    /**
     * Resolve the list of allowed values for an enum constraint, used in error messages.
     *
     * @param class-string|array<int, mixed> $constraint
     * @return array<int, mixed>
     */
    private static function allowedEnumValues(string|array $constraint): array {
        if (is_array($constraint)) {
            return $constraint;
        }

        if (!enum_exists($constraint)) {
            return [];
        }

        // Narrowing on the case rather than on $constraint is what makes this
        // analyzable: `$constraint::cases()` is only known to yield \UnitEnum,
        // which has no ->value. The two forms are equivalent — every case of a
        // backed enum is a \BackedEnum and no case of a pure enum is.
        return array_map(
            static fn(\UnitEnum $case): string|int => $case instanceof \BackedEnum ? $case->value : $case->name,
            $constraint::cases()
        );
    }

    /**
     * @param object $dto
     * @return array<string, mixed>
     */
    public static function toArray(object $dto): array {
        $result = [];
        $reflection = new ReflectionClass($dto);

        foreach ($reflection->getProperties(ReflectionProperty::IS_PUBLIC) as $property) {
            $value = $property->getValue($dto);
            if (is_object($value)) {
                $value = self::toArray($value);
            }
            $result[$property->getName()] = $value;
        }

        return $result;
    }
}

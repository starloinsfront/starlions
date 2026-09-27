import { Icon } from "@/common/components/Icon/Icon"
import { useLocationAutocomplete } from "../hooks/useLocationAutocomplete"
import styles from "./LocationField.module.css"

type LocationFieldProps = {
  location: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectLocation: (name: string) => void
}

export const LocationField = ({
  location,
  onChange,
  onSelectLocation,
}: LocationFieldProps) => {
  const {
    containerRef,
    showSuggestions,
    filteredSuggestions,
    handleFocus,
    handleSuggestionClick,
  } = useLocationAutocomplete(location, onSelectLocation)

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel} htmlFor="pub-location">
        Add location
      </label>
      <div className={styles.locationWrapper} ref={containerRef}>
        <input
          id="pub-location"
          className={styles.locationInput}
          type="text"
          placeholder="Location"
          value={location}
          onChange={onChange}
          onFocus={handleFocus}
        />
        <Icon
          name="pinOutline"
          width={20}
          height={20}
          className={styles.pinIcon}
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {filteredSuggestions.map((suggestion, index) => (
              <li key={`${suggestion.name}-${index}`}>
                <button
                  type="button"
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  <span className={styles.suggestionName}>{suggestion.name}</span>
                  <span className={styles.suggestionSub}>{suggestion.subName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

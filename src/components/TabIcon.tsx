type TabIconProps = {
  name: "home" | "courses" | "free" | "about" | "more" | "tests";
  active?: boolean;
};

export function TabIcon({ name, active }: TabIconProps) {
  const stroke = active ? 2.1 : 1.8;

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      aria-hidden="true"
    >
      {name === "home" ? (
        <path
          d="M4.5 10.8 12 4.6l7.5 6.2V19a1.4 1.4 0 0 1-1.4 1.4h-4.2v-5.2h-3.8V20.4H5.9A1.4 1.4 0 0 1 4.5 19V10.8Z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
      ) : null}

      {name === "courses" ? (
        <>
          <path
            d="M5 7.2c2.2-1.3 5.2-1.3 7 0 1.8-1.3 4.8-1.3 7 0v10.1c-2.2-1.2-5.2-1.2-7 0-1.8-1.2-4.8-1.2-7 0V7.2Z"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />
          <path
            d="M12 7.4v10"
            stroke={active ? "var(--bg)" : "currentColor"}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </>
      ) : null}

      {name === "free" ? (
        <>
          <path
            d="M7.2 10.2h9.6v8.2a1.6 1.6 0 0 1-1.6 1.6H8.8a1.6 1.6 0 0 1-1.6-1.6v-8.2Z"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />
          <path
            d="M6.4 7.6h11.2v2.6H6.4z"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />
          <path
            d="M12 7.6V20"
            stroke={active ? "var(--bg)" : "currentColor"}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d="M12 7.6c0-1.6-1.1-2.7-2.4-2.7S7.2 6.4 8.4 8M12 7.6c0-1.6 1.1-2.7 2.4-2.7S16.8 6.4 15.6 8"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : null}

      {name === "about" ? (
        <>
          <circle cx="12" cy="8.2" r="3.1" stroke="currentColor" strokeWidth={stroke} />
          <path
            d="M5.4 19.2c.7-3.2 3.2-4.8 6.6-4.8s5.9 1.6 6.6 4.8"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </>
      ) : null}

      {name === "tests" ? (
        <>
          <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth={stroke} />
          <path d="M8 9h8M8 12.5h8M8 16h5" stroke={active ? "var(--bg)" : "currentColor"} strokeWidth={stroke} strokeLinecap="round" />
        </>
      ) : null}

      {name === "more" ? (
        <>
          <rect x="4.4" y="4.4" width="6.2" height="6.2" rx="1.6" stroke="currentColor" strokeWidth={stroke} />
          <rect x="13.4" y="4.4" width="6.2" height="6.2" rx="1.6" stroke="currentColor" strokeWidth={stroke} />
          <rect x="4.4" y="13.4" width="6.2" height="6.2" rx="1.6" stroke="currentColor" strokeWidth={stroke} />
          <rect x="13.4" y="13.4" width="6.2" height="6.2" rx="1.6" stroke="currentColor" strokeWidth={stroke} />
        </>
      ) : null}
    </svg>
  );
}

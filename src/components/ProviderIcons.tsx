// Provider brand marks, keyed by driver kind. Official logos only.
import { Monitor } from "lucide-react";
import { cn } from "@/lib/cn";
import { HermesMark } from "./HermesMark";
import { CursorMark } from "./CursorMark";

export { HermesMark, CursorMark };

export interface IconProps {
  size?: number;
  className?: string;
}

export function GrokMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cn("fill-[#F5F5F5]", className)}>
      <path d="M9.26905 15.284L17.2479 9.36086C17.6391 9.07047 18.1981 9.18374 18.3845 9.63478C19.3655 12.0135 18.9272 14.8721 16.9755 16.8349C15.0238 18.7976 12.3082 19.228 9.8261 18.2477L7.1146 19.5102C11.0037 22.1834 15.7263 21.5223 18.6774 18.5525C21.0182 16.1985 21.7432 12.9897 21.0653 10.0961L21.0714 10.1023C20.0884 5.85143 21.3131 4.15233 23.8218 0.677913C23.8812 0.595532 23.9406 0.513151 24 0.428711L20.6987 3.74866V3.73836L9.267 15.2861" />
      <path d="M7.62249 16.7237C4.83113 14.0422 5.3124 9.89222 7.69417 7.49905C9.45541 5.72786 12.341 5.00497 14.86 6.06768L17.5653 4.81138C17.0779 4.45714 16.4533 4.07613 15.7365 3.80839C12.4966 2.46764 8.6178 3.13492 5.98413 5.78141C3.45081 8.32904 2.65415 12.2463 4.02219 15.5889C5.04412 18.0871 3.36889 19.8541 1.68137 21.6377C1.08337 22.2699 0.483318 22.9022 0 23.5716L7.62045 16.7257" />
    </svg>
  );
}

export function ClaudeMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 257" preserveAspectRatio="xMidYMid" className={cn("fill-[#d97757]", className)}>
      <path d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
    </svg>
  );
}

export function CodexMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 260" preserveAspectRatio="xMidYMid" className={cn("fill-white", className)}>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
  );
}

export function ComputerMark({ size = 16, className }: IconProps) {
  return <Monitor size={size} className={cn("text-ink-secondary", className)} />;
}

/** Official Kimi mark (Moonshot). */
export function KimiMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z"
        fill="#1783FF"
      />
      <path
        d="M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z"
        fill="#F5F5F5"
      />
    </svg>
  );
}

/** Official Factory Droid mark (factory.ai favicon). */
export function DroidMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 508 508" className={className} aria-hidden>
      <path
        fill="#FAFAFA"
        d="M321.997 150.712C321.401 150.568 320.844 150.299 320.363 149.925C319.883 149.551 319.491 149.08 319.215 148.544C318.938 148.008 318.783 147.42 318.76 146.821C318.738 146.22 318.848 145.624 319.084 145.07C327.226 125.716 330.819 110.23 325.021 103.747C309.666 86.5471 248.085 120.749 228.451 132.333C227.925 132.642 227.337 132.837 226.728 132.903C226.118 132.969 225.501 132.906 224.918 132.719C224.336 132.531 223.801 132.223 223.351 131.815C222.902 131.407 222.548 130.909 222.313 130.356C214.06 111.043 205.384 97.6094 196.589 97.0268C173.279 95.4688 154.491 162.187 148.991 183.932C148.844 184.515 148.57 185.06 148.188 185.528C147.805 185.998 147.323 186.381 146.775 186.651C146.227 186.921 145.626 187.072 145.012 187.094C144.399 187.116 143.788 187.009 143.221 186.778C123.406 178.825 107.545 175.316 100.914 180.98C83.305 195.978 118.315 256.126 130.175 275.304C130.492 275.816 130.692 276.391 130.76 276.987C130.829 277.582 130.765 278.186 130.573 278.755C130.381 279.325 130.065 279.847 129.647 280.286C129.228 280.725 128.718 281.07 128.15 281.298C108.384 289.359 94.6306 297.834 94.0272 306.424C92.439 329.192 160.74 347.544 183.01 352.916C183.605 353.061 184.16 353.33 184.64 353.704C185.118 354.077 185.509 354.548 185.785 355.083C186.061 355.618 186.215 356.205 186.237 356.803C186.26 357.402 186.151 357.998 185.916 358.551C177.773 377.905 174.181 393.398 179.979 399.874C195.334 417.074 256.921 382.877 276.556 371.293C277.081 370.984 277.67 370.789 278.28 370.722C278.889 370.655 279.507 370.717 280.09 370.905C280.673 371.093 281.207 371.402 281.657 371.81C282.106 372.219 282.46 372.717 282.694 373.271C290.947 392.578 299.616 406.012 308.417 406.601C331.728 408.153 350.516 341.44 356.009 319.688C356.157 319.106 356.432 318.562 356.816 318.094C357.2 317.625 357.682 317.243 358.231 316.974C358.779 316.705 359.381 316.554 359.995 316.533C360.608 316.511 361.219 316.619 361.786 316.85C381.601 324.803 397.455 328.304 404.093 322.648C421.702 307.65 386.684 247.495 374.825 228.317C374.51 227.804 374.312 227.229 374.245 226.634C374.177 226.039 374.242 225.436 374.434 224.868C374.626 224.299 374.941 223.777 375.358 223.338C375.775 222.899 376.284 222.552 376.85 222.323C396.623 214.261 410.376 205.786 410.973 197.196C412.568 174.428 344.26 156.078 321.997 150.712ZM295.254 128.885C299.734 136.73 276.646 189 259.474 225.561C259.186 226.172 258.715 226.682 258.121 227.024C257.528 227.365 256.842 227.521 256.155 227.47C255.468 227.419 254.814 227.164 254.28 226.739C253.746 226.314 253.358 225.739 253.169 225.093C246.234 201.322 238.306 173.392 229.824 149.683C229.491 148.752 229.508 147.736 229.871 146.817C230.235 145.897 230.921 145.133 231.808 144.662C252.989 133.363 289.234 118.358 295.254 128.885ZM193.746 135.355C202.589 137.807 224.103 190.714 238.424 228.426C238.664 229.056 238.699 229.742 238.527 230.393C238.354 231.044 237.983 231.627 237.461 232.065C236.939 232.503 236.292 232.775 235.608 232.844C234.923 232.913 234.234 232.775 233.632 232.45C211.501 220.453 185.694 206.159 162.529 195.253C161.622 194.823 160.901 194.093 160.493 193.192C160.085 192.292 160.018 191.279 160.303 190.335C167.12 167.736 181.865 132.069 193.746 135.355ZM126.652 210.04C134.676 205.664 188.197 228.216 225.621 244.989C226.248 245.269 226.771 245.73 227.12 246.31C227.47 246.889 227.629 247.56 227.577 248.23C227.524 248.901 227.264 249.54 226.828 250.062C226.393 250.582 225.805 250.962 225.143 251.147C200.813 257.921 172.211 265.664 147.937 273.949C146.985 274.272 145.946 274.255 145.007 273.9C144.067 273.545 143.286 272.876 142.805 272.011C131.257 251.322 115.867 215.92 126.652 210.04ZM133.275 309.188C135.779 300.551 189.952 279.537 228.562 265.548C229.207 265.315 229.91 265.28 230.576 265.448C231.243 265.617 231.84 265.98 232.288 266.49C232.736 266.999 233.015 267.631 233.085 268.299C233.155 268.968 233.015 269.641 232.682 270.23C220.392 291.846 205.758 317.053 194.592 339.672C194.156 340.561 193.409 341.269 192.486 341.668C191.563 342.068 190.525 342.134 189.557 341.853C166.42 335.235 129.905 320.792 133.275 309.188ZM209.739 374.722C205.252 366.884 228.347 314.608 245.519 278.054C245.806 277.442 246.279 276.931 246.872 276.59C247.465 276.249 248.151 276.093 248.838 276.144C249.525 276.194 250.179 276.45 250.713 276.875C251.247 277.3 251.634 277.874 251.824 278.521C258.759 302.285 266.686 330.222 275.169 353.932C275.499 354.862 275.481 355.877 275.117 356.795C274.752 357.713 274.064 358.475 273.178 358.945C252.004 370.223 215.752 385.256 209.76 374.722H209.739ZM311.247 368.252C302.397 365.807 280.883 312.894 266.562 275.182C266.322 274.55 266.285 273.862 266.458 273.21C266.63 272.559 267.003 271.974 267.526 271.536C268.049 271.097 268.697 270.826 269.382 270.758C270.068 270.69 270.759 270.83 271.361 271.157C293.485 283.154 319.299 297.455 342.457 308.362C343.366 308.789 344.089 309.519 344.497 310.42C344.905 311.321 344.971 312.335 344.683 313.28C337.872 335.912 323.128 371.544 311.247 368.252ZM378.341 293.566C370.31 297.949 316.795 275.391 279.365 258.618C278.738 258.338 278.215 257.877 277.866 257.297C277.516 256.718 277.357 256.047 277.409 255.377C277.461 254.706 277.722 254.067 278.158 253.546C278.593 253.025 279.181 252.646 279.843 252.461C304.18 245.687 332.775 237.943 357.049 229.658C358.003 229.335 359.043 229.353 359.984 229.709C360.925 230.065 361.706 230.737 362.188 231.603C373.729 252.285 389.119 287.693 378.341 293.566ZM371.718 194.419C369.207 203.063 315.041 224.077 276.431 238.066C275.784 238.3 275.08 238.335 274.413 238.167C273.746 237.999 273.148 237.635 272.698 237.124C272.249 236.613 271.972 235.98 271.903 235.31C271.833 234.641 271.975 233.966 272.311 233.377C284.594 211.768 299.228 186.554 310.394 163.935C310.833 163.048 311.58 162.343 312.502 161.945C313.425 161.546 314.462 161.481 315.429 161.76C338.566 168.413 375.081 182.815 371.718 194.419Z"
      />
    </svg>
  );
}

/** Official Google Antigravity mark. */
export function AntigravityMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cn("fill-[#F5F5F5]", className)} aria-hidden>
      <path
        fillRule="evenodd"
        d="M21.751 22.607c1.34 1.005 3.35.335 1.508-1.508C17.73 15.74 18.904 1 12.037 1 5.17 1 6.342 15.74.815 21.1c-2.01 2.009.167 2.511 1.507 1.506 5.192-3.517 4.857-9.714 9.715-9.714 4.857 0 4.522 6.197 9.714 9.715z"
      />
    </svg>
  );
}

/** Official OpenCode mark. */
export function OpenCodeMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cn("fill-[#F5F5F5]", className)} aria-hidden>
      <path fillRule="evenodd" d="M16 6H8v12h8V6zm4 16H4V2h16v20z" />
    </svg>
  );
}

/** Official Qwen mark. */
export function QwenMark({ size = 16, className }: IconProps) {
  const grad = "omb-qwen-mark";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill={`url(#${grad})`}
        fillRule="nonzero"
        d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z"
      />
      <defs>
        <linearGradient id={grad} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#6336E7" stopOpacity={0.92} />
          <stop offset="100%" stopColor="#6F69F7" stopOpacity={0.92} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Official pi (pi.dev) mark — geometric "Pi" wordmark from pi.dev/logo.svg. */
export function PiMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 800 800" className={cn("fill-[#F5F5F5]", className)} aria-hidden>
      {/* P shape: outer boundary clockwise, inner hole counter-clockwise */}
      <path
        fillRule="evenodd"
        d="M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z"
      />
      {/* i dot */}
      <path d="M517.36 400 H634.72 V634.72 H517.36 Z" />
    </svg>
  );
}


/** Official gemini mark. */
export function GeminiMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#8E75B2" className={className} aria-hidden>
            <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
          </svg>
  );
}

/** Official copilot mark. */
export function CopilotMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f4f4f5" className={className} aria-hidden>
            <path d="M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Z" />
          </svg>
  );
}

/** Official ollama mark. */
export function OllamaMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f4f4f5" className={className} aria-hidden>
            <path d="M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm9-5.024S16.545-1.675 0 8.914 21 12.976 21 12.976Zm-2.687.461A9.094 9.094 0 0 1 12 14.364a9.094 9.094 0 0 1-6.313-2.927 9.158 9.158 0 0 1 12.626 0Z" />
          </svg>
  );
}

/** Official openrouter mark. */
export function OpenrouterMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#94A3B8" className={className} aria-hidden>
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.5 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-1.5 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm1.5 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
          </svg>
  );
}

/** Official minimax mark. */
export function MinimaxMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E73562" className={className} aria-hidden>
            <path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
  );
}

/** Official cline mark. */
export function ClineMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f4f4f5" className={className} aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 15.5v-11l6 5.5-6 5.5Z" />
          </svg>
  );
}

/** Official kiro mark. */
export function KiroMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="272 202 654 795" fill="#9046FF" className={className} aria-hidden>
            <path d="M398.554 818.914C316.315 1001.03 491.477 1046.74 620.672 940.156C658.687 1059.66 801.052 970.473 852.234 877.795C964.787 673.567 919.318 465.357 907.64 422.374C827.637 129.443 427.623 128.946 358.8 423.865C342.651 475.544 342.402 534.18 333.458 595.051C328.986 625.86 325.507 645.488 313.83 677.785C306.873 696.424 297.68 712.819 282.773 740.645C259.915 783.881 269.604 867.113 387.87 823.883L399.051 818.914H398.554Z" />
          </svg>
  );
}

/** Official letta mark. */
export function LettaMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 224 224" fill="#e4e4e7" className={className} aria-hidden>
            <path d="M168.904 42.8702V17H54.9746V42.8702C54.9746 49.5579 49.558 54.9746 42.8702 54.9746H17V168.904H42.8702C49.558 168.904 54.9746 174.32 54.9746 181.008V206.878H168.904V181.008C168.904 174.32 174.32 168.904 181.008 168.904H206.878V54.9746H181.008C174.32 54.9746 168.904 49.5579 168.904 42.8702ZM168.904 156.794C168.904 163.482 163.487 168.898 156.799 168.898H67.0842C60.3965 168.898 54.9799 163.482 54.9799 156.794V67.079C54.9799 60.3912 60.3965 54.9746 67.0842 54.9746H156.799C163.487 54.9746 168.904 60.3912 168.904 67.079V156.794Z" />
          </svg>
  );
}

/** Official omp mark. */
export function OmpMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
            <defs>
            <linearGradient id="ompg" x1={0} y1={0} x2={1} y2={1}>
            <stop offset={0} stopColor="#ed4abf" />
            <stop offset={.5} stopColor="#9b4dff" />
            <stop offset={1} stopColor="#5ad8e6" />
          </linearGradient>
          </defs>
            <rect width={64} height={64} rx={12} fill="#0f0a14" />
            <path fill="url(#ompg)" d="M14 16h36v8H40v32h-8V24h-6v22h-8V24h-4z" />
          </svg>
  );
}

/** Official zihin mark. */
export function ZihinMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 173" className={className} aria-hidden>
            <path d="M134.16 86.44C123.38 86.44 113.07 88.41 103.55 92.01C103.67 90.17 103.73 88.31 103.73 86.44C103.73 59.14 91.07 34.79 71.3 18.95C76.17 17.86 81.24 17.29 86.44 17.29C117.09 17.29 143.07 37.22 152.15 64.83H170.16C160.56 27.55 126.72 0 86.44 0C38.7 0 0 38.7 0 86.44C0 120.44 19.63 149.85 48.17 163.97C59.71 169.68 72.7 172.88 86.44 172.88C131.17 172.88 167.97 138.9 172.43 95.35C160.89 89.64 147.9 86.44 134.16 86.44Z" fill="#004B1C" />
            <path d="M17.2898 86.44C17.2898 60.84 31.1998 38.5 51.8598 26.54C72.5298 38.5 86.4398 60.84 86.4398 86.44C86.4398 91.79 85.8298 96.9901 84.6798 101.99C69.3798 112.69 57.6998 128.21 51.8598 146.35C31.1898 134.39 17.2798 112.04 17.2798 86.45L17.2898 86.44Z" fill="#8DC63F" />
            <path d="M86.4399 155.6C80.0099 155.6 73.7899 154.72 67.8799 153.08C76.3999 124.54 102.85 103.73 134.16 103.73C140.59 103.73 146.81 104.61 152.72 106.25C144.2 134.79 117.75 155.6 86.4399 155.6Z" fill="#F37021" />
            <path d="M152.72 106.25L67.8799 153.08C73.7899 154.72 80.0099 155.6 86.4399 155.6C117.75 155.6 144.2 134.79 152.72 106.25Z" fill="#C85C1A" />
            <path d="M84.6901 101.99C85.8401 96.9901 86.4501 91.79 86.4501 86.44C86.4501 60.84 72.5401 38.5 51.8701 26.54V146.34C57.7201 128.2 69.4001 112.68 84.6901 101.98V101.99Z" fill="#73A533" />
          </svg>
  );
}

/** Official mnemopay mark. */
export function MnemopayMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
            <rect width={64} height={64} rx={14} fill="#050710" />
            <path d="M12 48V16l10 16 10-16 10 16 10-16v32" fill="none" stroke="#7AB8FF" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
  );
}

/** Official errand mark. */
export function ErrandMark({ size = 16, className }: IconProps) {
  return (
    <img src="data:image/png;base64,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" width={size} height={size} className={className} alt="" />
  );
}

/** Official agrenting mark. */
export function AgrentingMark({ size = 16, className }: IconProps) {
  return (
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE+ElEQVR42uVVW2xUVRTd575n7sy0zPQxFQrt9MUrKvSnEIklRNEQjNEUCUGQGP3xy0eiYsLtIBAS7YdEomKUhGCiJWCIiUZRYYxokBYpY1sKSJ3bzqOdznTmzp37OPdx/ClJoTUQ/4z796ysvc5aO3sD/NcL3StQkiRqxdAQAgAYXL6cRKNRAgDk1jshBEF3NzoxgwEA6Oo94d6VmBBA8wkhAEiSJEqSJIoQgv7VDwgAQjMqe/btXmia5n0U5aKsSk309PQkZmPPvLQhpNB1dbSHC+o0JxKvkK1c3RhHd7GPHHnn7UYD8PO4rG4nNvYz4JJSESu5In0hq5Bjj3csohSKX2vQ/lYTxDrDobhqK21VaGkPxcNlNL8tBCGEyCcfHNziOtbDyFIfBcdsZMFRGMtd4JoIxoscDPz+J2YXhwsN969mUVH1cS5dnvaF6XhoRWpz/ruJKi0RoecLc/369eTTQ/vX0eCc5pHZ4WNxotZv/xZgiI8nTAWA8L05bbpWWakZ7o+LmiyfXeKB0+aEvKINMnymIcIEdQWqNfmrOQ1isRgQQtBgPNboYcy8wOG9YQ854aWJixw0CZr7jZ0qFV0bdxanslxKTsHVTFYrhlZGG0S302xaGLTC/nKrPDDMYLyHmcceQAgRADgHAOdGj+4UynxFTVl3LtAZrY8vms2EZTdm5TFOy2ZRZe0CSCvOg2Lh+kfB9qWB8ebFxcbR+F/ClNy95XCvzNw5UQghcuxAT7NIDIGvmJ4qCLQAN6dqqKzBcyLdaIP62PSNdCtWMF/TXEfyRRtVoxJpWRVun17ZmgqPyQO1I9f3bz3Se4kAIHr2xAAAnJR2d5iEaeIo3anUdKBSpUrWpgJerhxhzfxWrJSecLysyLc1giWKSNEtN7KmreDteEAOThR+qI337932ce8VIgGFYkDoWTNPNezp3p4O17/JGXam2VJkkRhQ6eQ9Xo/xDDIKr4e8ZJld7c8KbU0Z1eXFjEkcdmVLxvL5i+qvw+deGPjitbWf92WIJFEoGnMBABhCCILOTvr4ukd2pBYtecPOTvDCjURrjtab/VShFnntNTwQL8dxA9hvxfigeP5G2t0so8Amvb6ukE9MGle+7Y+kJ4zEoYm01tXVRaNo1LnN95OvHtw0sqxljz05vooeGjoouL6pGg9+z8eUIMRbn4U8+pERb5WlWKheDQSfMgLB1ThX0pIDg1z/pdH68WkdiRW+zpGbF/tm2w0AwJx5VmodDdY9WZETsT4yZk8xvPPW0Xff/zB6wOFpXyihTv70Bx1sJWxgh1PhXUgs4og//kIlRxJ1g44QzGiEQaxw+Npo3xxyAACmFPA9bTlVVstNEWMjjK+xqecO7XylRaUQUUPepaSyYRfF0ZSLHU0bSZatwasL8snJmmFG5MY0E3RsnxfE4L6ZhTe3AXBMpNLJkavhJiOEHxr3+tJlRSiss3kLgWsm9ExOziWTzWouHymbFlc0BZgSQpAvqmBazimKDbycSMQyM+Rz1jNjsnCKN5O7gsJppeDzXwYPrfkZ/WevpY35TO3sxf6EnlDcbXnb3qBitUo3dQPr1nWbMCdDociXQ0Mn8HzKbwv5qCQ1iBi3MGBg2lCSQlZObzx+pjwb2N7+Imua6SBCLo7Hv56exfeP5Hc5NATd8lWSJGoeYdQ9n8w7z2F3NErQXFWzQyTwv6m/AYvHmHKqYXquAAAAAElFTkSuQmCC" width={size} height={size} className={className} alt="" />
  );
}

/** Official openclaw mark. */
export function OpenclawMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="#ff4d4d" className={className} aria-hidden>
            <path d="M60 10C30 10 15 35 15 55C15 75 30 95 45 100L45 110L55 110L55 100C55 100 60 102 65 100L65 110L75 110L75 100C90 95 105 75 105 55C105 35 90 10 60 10Z" />
            <path d="M20 45C5 40 0 50 5 60C10 70 20 65 25 55C28 48 25 45 20 45Z" />
            <path d="M100 45C115 40 120 50 115 60C110 70 100 65 95 55C92 48 95 45 100 45Z" />
          </svg>
  );
}

/** Official paperclip mark. */
export function PaperclipMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e4e4e7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
  );
}

export function ProviderMark({ driverKind, size, className }: IconProps & { driverKind: string }) {
  switch (driverKind) {
    case "grok":
    case "grokAgent":
      return <GrokMark size={size} className={className} />;
    case "claudeAgent":
      return <ClaudeMark size={size} className={className} />;
    case "codex":
      return <CodexMark size={size} className={className} />;
    case "kimiAgent":
      return <KimiMark size={size} className={className} />;
    case "droidAgent":
      return <DroidMark size={size} className={className} />;
    case "cursorAgent":
      return <CursorMark size={size} className={className} />;
    case "antigravityAgent":
      return <AntigravityMark size={size} className={className} />;
    case "opencodeGo":
      return <OpenCodeMark size={size} className={className} />;
    case "qwenAgent":
      return <QwenMark size={size} className={className} />;
    case "hermesAgent":
      return <HermesMark size={size} className={className} />;
    case "boxAgent":
      return <ComputerMark size={size} className={className} />;
    case "piAgent":
      return <PiMark size={size} className={className} />;
    case "geminiAgent":
    case "gemini":
      return <GeminiMark size={size} className={className} />;

    case "copilotAgent":
    case "copilot":
      return <CopilotMark size={size} className={className} />;

    case "ollamaAgent":
    case "ollama":
      return <OllamaMark size={size} className={className} />;

    case "openrouterAgent":
    case "openrouter":
      return <OpenrouterMark size={size} className={className} />;

    case "minimaxAgent":
    case "minimax":
      return <MinimaxMark size={size} className={className} />;

    case "clineAgent":
    case "cline":
      return <ClineMark size={size} className={className} />;

    case "kiroAgent":
    case "kiro":
      return <KiroMark size={size} className={className} />;

    case "lettaAgent":
    case "letta":
      return <LettaMark size={size} className={className} />;

    case "ompAgent":
    case "omp":
      return <OmpMark size={size} className={className} />;

    case "zihinAgent":
    case "zihin":
      return <ZihinMark size={size} className={className} />;

    case "mnemopayAgent":
    case "mnemopay":
      return <MnemopayMark size={size} className={className} />;

    case "errandAgent":
    case "errand":
      return <ErrandMark size={size} className={className} />;

    case "agrentingAgent":
    case "agrenting":
      return <AgrentingMark size={size} className={className} />;

    case "openclawAgent":
    case "openclaw":
      return <OpenclawMark size={size} className={className} />;

    case "paperclip":
      return <PaperclipMark size={size} className={className} />;
    default:
      return (
        <span className="flex size-full items-center justify-center text-[10px] font-semibold tracking-tight text-ink-secondary">
          {(driverKind.replace(/Agent$/i, "").slice(0, 1) || "?").toUpperCase()}
        </span>
      );
  }
}

import { m } from "@/paraglide/messages";

function Loader() {
    return (
        <div className="text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height={100}
                width={100}
                viewBox="0 0 200 200"
                className="mx-auto"
            >
                <circle
                    fill="#787373"
                    stroke="#787373"
                    strokeWidth="15"
                    r="15"
                    cx="40"
                    cy="100"
                >
                    <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.4"
                    ></animate>
                </circle>
                <circle
                    fill="#787373"
                    stroke="#787373"
                    strokeWidth="15"
                    r="15"
                    cx="100"
                    cy="100"
                >
                    <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.2"
                    ></animate>
                </circle>
                <circle
                    fill="#787373"
                    stroke="#787373"
                    strokeWidth="15"
                    r="15"
                    cx="160"
                    cy="100"
                >
                    <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="0"
                    ></animate>
                </circle>
            </svg>
            <p className="mx-auto text-muted-foreground">
                {m["common.loading"]()}
            </p>
        </div>
    );
}

export default Loader;

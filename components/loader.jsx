export default function FallBackLoader() {
    return (
        <>
            <div className="mainLoaderCont">
                <div className="temp">
                    <span className="mainLoader"></span>
                </div>
            </div>
        </>
    )
}
export function ChildLoader() {
    return (
        <>
            <div className="childLoaderCont">
                <div className="temp">
                    <span className="mainLoader"></span>
                </div>
            </div>
        </>
    )
}
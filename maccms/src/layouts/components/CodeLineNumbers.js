
export default  function CodeLineNumbers ({lines}) {

    return (
        <div className="code-line-numbers">
            {Array.from({length: lines}, (_, index) => (
                <div key={index + 1} className="text-[14px] leading-[22.74px] font-primary">{index + 1}</div>
            ))}
        </div>
    );
}
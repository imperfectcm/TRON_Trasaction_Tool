import { useContainerStore } from "@/utils/store";


const BalanceBox = () => {
    const { balanceRes } = useContainerStore();
    return (
        <section className="text-zinc-300">
            {balanceRes && balanceRes}
        </section>
    )
}

export default BalanceBox;
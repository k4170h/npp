export const Matter = (Phaser.Physics.Matter as any).Matter as typeof MatterJS;

export class GoalManager {
    static counter = 0;
    static goaledMarbles: string[] = [];

    static onGoalCallbacks: ((
        counter: number,
        key: string,
        keys: string[]
    ) => void)[] = [];

    static goal(key: string) {
        GoalManager.goaledMarbles.push(key);
        ++GoalManager.counter;
        GoalManager.onGoalCallbacks.forEach((v) =>
            v(GoalManager.counter, key, GoalManager.goaledMarbles)
        );
        return GoalManager.counter;
    }

    static setCallback(callback: () => {}) {
        GoalManager.onGoalCallbacks.push(callback);
    }
}


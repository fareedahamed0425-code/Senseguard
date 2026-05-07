import subprocess
import os

class SystemAgent:
    POWER_PLANS = {
        "high_performance": "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
        "balanced": "381b4222-f694-41f0-9685-ff5bb260df2e",
        "power_saver": "a1841308-3541-4fab-bc81-f71556f20b4a"
    }

    def set_power_plan(self, plan_name):
        """
        Switches the Windows power plan using powercfg.
        """
        if plan_name not in self.POWER_PLANS:
            return False, f"Unknown plan: {plan_name}"
        
        guid = self.POWER_PLANS[plan_name]
        try:
            subprocess.run(["powercfg", "/setactive", guid], check=True)
            return True, f"Successfully switched to {plan_name}"
        except subprocess.CalledProcessError as e:
            return False, str(e)

    def optimize_for_gaming(self):
        """
        Triggers high performance mode and could be extended to suspend background processes.
        """
        return self.set_power_plan("high_performance")

    def restore_defaults(self):
        return self.set_power_plan("balanced")

if __name__ == "__main__":
    agent = SystemAgent()
    # Test switching (might require admin privileges on some systems)
    success, msg = agent.optimize_for_gaming()
    print(msg)

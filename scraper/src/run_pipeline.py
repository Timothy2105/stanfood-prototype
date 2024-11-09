import subprocess
import sys
import os

def run_script(script_name):
    """
    Run a Python script and check for successful execution
    """
    print(f"\n=== Running {script_name} ===")
    
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error running {script_name}:")
        print(result.stderr)
        sys.exit(1)
    
    print(result.stdout)
    print(f"=== Successfully completed {script_name} ===\n")

def main():
    # List of scripts to run in order
    scripts = [
        "scrape_menu.py",
        "processing.py",
        "create_filters.py"
    ]
    
    print("Starting data pipeline...")
    
    for script in scripts:
        run_script(script)
    
    print("Data pipeline completed successfully!")

if __name__ == "__main__":
    main()
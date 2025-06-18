#!/bin/bash

# Usage: ./run_ghdl.sh design.vhd testbench.vhd tb_entity_name

set -e  # Exit on first error

DESIGN_FILE=$1
TESTBENCH_FILE=$2
TOP_ENTITY=$3

# Check inputs
if [[ -z "$DESIGN_FILE" || -z "$TESTBENCH_FILE" || -z "$TOP_ENTITY" ]]; then
  echo "Usage: $0 <design.vhd> <testbench.vhd> <top_entity>"
  exit 1
fi

# Optional: set working dir (clean, temp space)
WORK_DIR="./ghdl_out"
rm -rf ghdl_out
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Copy input files
cp "../../$DESIGN_FILE" .
cp "../../$TESTBENCH_FILE" .

# Analyze
ghdl -a --std=08 "$DESIGN_FILE"
ghdl -a --std=08 "$TESTBENCH_FILE"

# Elaborate
ghdl -e --std=08 "$TOP_ENTITY"


# Run simulation
ghdl -r --std=08 "$TOP_ENTITY" --stop-time=10ms --vcd=wave.vcd 2>&1 | tee sim_log.txt
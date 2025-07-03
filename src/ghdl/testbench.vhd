library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_lxp32_mul16x16 is
end entity;

architecture behavioral of tb_lxp32_mul16x16 is

    constant CLK_PERIOD : time := 10 ns;

    -- Signals for UUT ports
    signal clk_i : std_logic := '0';
    signal a_i   : std_logic_vector(15 downto 0) := (others => '0');
    signal b_i   : std_logic_vector(15 downto 0) := (others => '0');
    signal p_o   : std_logic_vector(31 downto 0);

    -- Simulation control
    signal sim_done : boolean := false;

begin

    ------------------------------------------------------------------------
    -- Clock generation: 100 MHz clock (10 ns period)
    ------------------------------------------------------------------------
    clk_process : process
    begin
        while not sim_done loop
            clk_i <= '0';
            wait for CLK_PERIOD / 2;
            clk_i <= '1';
            wait for CLK_PERIOD / 2;
        end loop;
        wait;
    end process;

    ------------------------------------------------------------------------
    -- Instantiate the Unit Under Test (UUT)
    ------------------------------------------------------------------------
    uut: entity work.lxp32_mul16x16
        port map (
            clk_i => clk_i,
            a_i   => a_i,
            b_i   => b_i,
            p_o   => p_o
        );

    ------------------------------------------------------------------------
    -- Stimulus process: applies test vectors and checks results
    ------------------------------------------------------------------------
    stim_proc: process
        variable expected_result : unsigned(31 downto 0);
        variable a_val, b_val    : unsigned(15 downto 0);
    begin
        -- Wait for global reset (not used but wait a few cycles)
        wait for 20 * CLK_PERIOD;

        --------------------------------------------------------------------
        -- Test 1: Multiply zero by zero
        --------------------------------------------------------------------
        a_i <= (others => '0');
        b_i <= (others => '0');
        wait until rising_edge(clk_i);
        wait until rising_edge(clk_i); -- wait one clock for registered output

        expected_result := (others => '0');
        assert p_o = std_logic_vector(expected_result)
            report "Test 1 failed: 0 * 0 != 0"
            severity error;

        --------------------------------------------------------------------
        -- Test 2: Multiply max unsigned values (65535 * 65535)
        --------------------------------------------------------------------
        a_i <= x"FFFF";
        b_i <= x"FFFF";
        wait until rising_edge(clk_i);
        wait until rising_edge(clk_i);

        a_val := unsigned(x"FFFF");
        b_val := unsigned(x"FFFF");
        expected_result := a_val * b_val;

        assert p_o = std_logic_vector(expected_result)
            report "Test 2 failed: 65535 * 65535 incorrect"
            severity error;

        --------------------------------------------------------------------
        -- Test 3: Multiply 12345 * 54321
        --------------------------------------------------------------------
        a_i <= std_logic_vector(to_unsigned(12345,16));
        b_i <= std_logic_vector(to_unsigned(54321,16));
        wait until rising_edge(clk_i);
        wait until rising_edge(clk_i);

        a_val := to_unsigned(12345,16);
        b_val := to_unsigned(54321,16);
        expected_result := a_val * b_val;

        assert p_o = std_logic_vector(expected_result)
            report "Test 3 failed: 12345 * 54321 incorrect"
            severity error;

        --------------------------------------------------------------------
        -- Test 4: Multiply 1 * 0x8000 (32768)
        --------------------------------------------------------------------
        a_i <= std_logic_vector(to_unsigned(1,16));
        b_i <= x"8000";
        wait until rising_edge(clk_i);
        wait until rising_edge(clk_i);

        a_val := to_unsigned(1,16);
        b_val := unsigned(x"8000");
        expected_result := a_val * b_val;

        assert p_o = std_logic_vector(expected_result)
            report "Test 4 failed: 1 * 32768 incorrect"
            severity error;

        --------------------------------------------------------------------
        -- Test 5: Multiply random values
        --------------------------------------------------------------------
        for i in 0 to 10 loop
            a_val := to_unsigned(i * 1234 mod 65536, 16);
            b_val := to_unsigned((i * 4321 + 1000) mod 65536, 16);

            a_i <= std_logic_vector(a_val);
            b_i <= std_logic_vector(b_val);

            wait until rising_edge(clk_i);
            wait until rising_edge(clk_i);

            expected_result := a_val * b_val;
            assert p_o = std_logic_vector(expected_result)
                report "Test 5 failed at iteration " & integer'image(i) & 
                       ": " & integer'image(to_integer(a_val)) & " * " & integer'image(to_integer(b_val)) & 
                       " incorrect"
                severity error;
        end loop;

        --------------------------------------------------------------------
        -- End simulation
        --------------------------------------------------------------------
        report "All multiplier tests passed successfully.";
        sim_done <= true;
        wait;
    end process;

end behavioral;

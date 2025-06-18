library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use std.env.all;

entity tb_lxp32_mul16x16 is
end entity;

architecture tb of tb_lxp32_mul16x16 is
    constant CLK_PERIOD : time := 10 ns;
    signal clk     : std_logic := '0';
    signal a         : std_logic_vector(15 downto 0) := (others => '0');
    signal b         : std_logic_vector(15 downto 0) := (others => '0');
    signal p         : std_logic_vector(31 downto 0);

    component lxp32_mul16x16
        port (
            clk_i : in std_logic;
            a_i  : in std_logic_vector(15 downto 0);
            b_i  : in std_logic_vector(15 downto 0);
            p_o  : out std_logic_vector(31 downto 0)
        );
    end component;

begin
    -- Instantiate the design under test (DUT)
    dut : lxp32_mul16x16
        port map (
            clk_i => clk,
            a_i   => a,
            b_i   => b,
            p_o   => p
        );

    -- Clock generation
    clk_process : process
    begin
        while true loop
            clk <= '0';
            wait for CLK_PERIOD / 2;
            clk <= '1';
            wait for CLK_PERIOD / 2;
        end loop;
        wait;
    end process;

    -- Stimulus process
    stim_proc : process
        variable a_var, b_var : unsigned(15 downto 0);
        variable p_expect : unsigned(31 downto 0);
    begin
            -- Normal operating conditions
            a_var := to_unsigned(10, 16);
            b_var := to_unsigned(20, 16);
            a <= std_logic_vector(a_var);
            b <= std_logic_vector(b_var);
            wait for CLK_PERIOD;
            p_expect := a_var * b_var;
            assert p = std_logic_vector(p_expect) report "Multiplication error" severity error;

            -- Edge cases
            a_var := to_unsigned(0, 16);
            b_var := to_unsigned(1, 16);
            a <= std_logic_vector(a_var);
            b <= std_logic_vector(b_var);
            wait for CLK_PERIOD;
            p_expect := a_var * b_var;
            assert p = std_logic_vector(p_expect) report "Multiplication error" severity error;

            a_var := to_unsigned(65535, 16);
            b_var := to_unsigned(1, 16);
            a <= std_logic_vector(a_var);
            b <= std_logic_vector(b_var);
            wait for CLK_PERIOD;
            p_expect := a_var * b_var;
            assert p = std_logic_vector(p_expect) report "Multiplication error" severity error;

            -- Terminate the simulation
            wait for CLK_PERIOD;
            report "Simulation complete" severity note;
            stop;
        end process;
end architecture;
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity lxp32_mul16x16 is
    Port ( clk_i : in  STD_LOGIC;
           a_i : in  STD_LOGIC_VECTOR(15 downto 0);
           b_i : in  STD_LOGIC_VECTOR(15 downto 0);
           p_o : out  STD_LOGIC_VECTOR(31 downto 0));
end lxp32_mul16x16;

architecture rtl of lxp32_mul16x16 is
    -- internal signal for product
    signal product_reg : STD_LOGIC_VECTOR(31 downto 0);

begin
    -- clocked process: multiplication
    process(clk_i)
    begin
        if rising_edge(clk_i) then
            -- perform unsigned multiplication
            product_reg <= std_logic_vector(unsigned(a_i) * unsigned(b_i));
        end if;
    end process;

    -- combinational output
    p_o <= product_reg;
end architecture rtl;